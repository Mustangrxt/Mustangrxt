#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime, timezone

class PathfinderDSMTester:
    def __init__(self):
        self.base_url = "https://granite-fast-1.preview.emergentagent.com/api"
        self.session_token = None
        self.user_data = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []
    
    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
        
        result = {
            "test": name,
            "status": "PASS" if success else "FAIL",
            "details": details
        }
        self.test_results.append(result)
        print(f"{'✅' if success else '❌'} {name}: {details}")
        return success

    def run_request(self, method, endpoint, data=None, expected_status=200):
        """Run HTTP request with error handling"""
        url = f"{self.base_url}{endpoint}"
        headers = {
            'Content-Type': 'application/json'
        }
        
        # Add auth header if we have a session token
        if self.session_token:
            headers['Authorization'] = f'Bearer {self.session_token}'
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, headers=headers, json=data, timeout=10)
            elif method == 'PATCH':
                response = requests.patch(url, headers=headers, json=data, timeout=10)
            else:
                return False, {"error": f"Unsupported method: {method}"}
                
            if response.status_code == expected_status:
                try:
                    return True, response.json()
                except:
                    return True, {"message": "Success - no JSON response"}
            else:
                try:
                    error_detail = response.json()
                except:
                    error_detail = {"error": f"Status {response.status_code}", "text": response.text[:200]}
                return False, error_detail
                
        except requests.exceptions.RequestException as e:
            return False, {"error": f"Request failed: {str(e)}"}

    def test_root_endpoint(self):
        """Test basic API connectivity"""
        success, result = self.run_request('GET', '/')
        return self.log_test(
            "Root API endpoint",
            success and "Pathfinder DSM API" in str(result),
            f"Response: {result}"
        )

    def test_laws_endpoint(self):
        """Test 12 Laws endpoint"""
        success, result = self.run_request('GET', '/laws')
        is_valid = success and isinstance(result, list) and len(result) == 12
        details = f"Found {len(result) if isinstance(result, list) else 0} laws" if success else str(result)
        return self.log_test("12 Laws endpoint", is_valid, details)

    def create_test_session(self):
        """Create a test session using MongoDB directly"""
        try:
            import subprocess
            import uuid
            
            user_id = f"test_user_{uuid.uuid4().hex[:12]}"
            session_token = f"test_session_{uuid.uuid4().hex}"
            email = f"test.{uuid.uuid4().hex[:8]}@example.com"
            
            # Create test user and session via MongoDB
            mongo_commands = f"""
            use('test_database');
            
            db.users.insertOne({{
                user_id: '{user_id}',
                email: '{email}',
                name: 'Test User',
                picture: 'https://via.placeholder.com/150',
                is_pro: false,
                golden_badge: false,
                created_at: '{datetime.now(timezone.utc).isoformat()}'
            }});
            
            db.user_sessions.insertOne({{
                user_id: '{user_id}',
                session_token: '{session_token}',
                expires_at: '{(datetime.now(timezone.utc)).replace(hour=23, minute=59, second=59).isoformat()}',
                created_at: '{datetime.now(timezone.utc).isoformat()}'
            }});
            """
            
            result = subprocess.run(
                ['mongosh', '--eval', mongo_commands],
                capture_output=True,
                text=True,
                timeout=10
            )
            
            if result.returncode == 0:
                self.session_token = session_token
                self.user_data = {"user_id": user_id, "email": email}
                return self.log_test("Create test session", True, f"Session: {session_token}")
            else:
                return self.log_test("Create test session", False, f"MongoDB error: {result.stderr}")
                
        except Exception as e:
            return self.log_test("Create test session", False, f"Error: {str(e)}")

    def test_auth_me(self):
        """Test /auth/me endpoint with session token"""
        if not self.session_token:
            return self.log_test("Auth me endpoint", False, "No session token available")
            
        success, result = self.run_request('GET', '/auth/me')
        is_valid = success and result.get('user_id') == self.user_data['user_id']
        details = f"User: {result.get('name', 'Unknown')}" if success else str(result)
        return self.log_test("Auth me endpoint", is_valid, details)

    def test_transmutation_create(self):
        """Test creating a transmutation session"""
        if not self.session_token:
            return self.log_test("Create transmutation", False, "No session token available")
        
        success, result = self.run_request('POST', '/transmutations', {
            "goal_hours": 24.0,
            "start_time": datetime.now(timezone.utc).isoformat()
        }, expected_status=201)
        
        is_valid = success and result.get('transmutation_id') and result.get('is_active')
        details = f"ID: {result.get('transmutation_id', 'None')}" if success else str(result)
        
        # Store transmutation_id for future tests
        if is_valid:
            self.transmutation_id = result.get('transmutation_id')
            
        return self.log_test("Create transmutation", is_valid, details)

    def test_transmutation_active(self):
        """Test getting active transmutation"""
        if not self.session_token:
            return self.log_test("Get active transmutation", False, "No session token available")
            
        success, result = self.run_request('GET', '/transmutations/active')
        is_valid = success and (result is None or result.get('is_active'))
        details = f"Active: {result.get('is_active') if result else 'None'}" if success else str(result)
        return self.log_test("Get active transmutation", is_valid, details)

    def test_transmutation_stats(self):
        """Test getting transmutation statistics"""
        if not self.session_token:
            return self.log_test("Get transmutation stats", False, "No session token available")
            
        success, result = self.run_request('GET', '/transmutations/stats')
        is_valid = success and 'total_transmutations' in result
        details = f"Total: {result.get('total_transmutations', 0)}" if success else str(result)
        return self.log_test("Get transmutation stats", is_valid, details)

    def test_coach_prompts_remaining(self):
        """Test checking remaining prompts"""
        if not self.session_token:
            return self.log_test("Coach prompts remaining", False, "No session token available")
            
        success, result = self.run_request('GET', '/coach/prompts-remaining')
        is_valid = success and 'prompts_remaining' in result
        details = f"Remaining: {result.get('prompts_remaining', 0)}" if success else str(result)
        return self.log_test("Coach prompts remaining", is_valid, details)

    def test_coach_chat(self):
        """Test AI coach chat functionality"""
        if not self.session_token:
            return self.log_test("Coach chat", False, "No session token available")
        
        # Test with a simple question
        success, result = self.run_request('POST', '/coach/chat', {
            "message": "What happens during the first hour of fasting?"
        })
        
        is_valid = success and result.get('flesh') and result.get('spirit')
        details = f"Flesh response: {len(str(result.get('flesh', '')))} chars" if success else str(result)
        return self.log_test("Coach chat", is_valid, details)

    def test_subscription_checkout(self):
        """Test creating Stripe checkout session"""
        if not self.session_token:
            return self.log_test("Subscription checkout", False, "No session token available")
            
        success, result = self.run_request('POST', '/subscription/checkout', {
            "plan": "monthly",
            "origin_url": "https://granite-fast-1.preview.emergentagent.com"
        })
        
        is_valid = success and result.get('url') and result.get('session_id')
        details = f"Session ID: {result.get('session_id', 'None')[:20]}..." if success else str(result)
        return self.log_test("Subscription checkout", is_valid, details)

    def cleanup_test_data(self):
        """Clean up test data from MongoDB"""
        if not self.user_data:
            return
            
        try:
            import subprocess
            
            mongo_commands = f"""
            use('test_database');
            db.users.deleteMany({{email: /test\\./}});
            db.user_sessions.deleteMany({{session_token: /test_session/}});
            db.transmutations.deleteMany({{user_id: '{self.user_data['user_id']}'}});
            """
            
            subprocess.run(
                ['mongosh', '--eval', mongo_commands],
                capture_output=True,
                text=True,
                timeout=10
            )
            print("🧹 Cleaned up test data")
        except Exception as e:
            print(f"⚠️  Cleanup failed: {e}")

    def run_all_tests(self):
        """Run all backend tests"""
        print("🔧 Starting Pathfinder DSM Backend API Tests")
        print("=" * 60)
        
        # Basic connectivity tests
        self.test_root_endpoint()
        self.test_laws_endpoint()
        
        # Auth tests (require test session)
        if self.create_test_session():
            self.test_auth_me()
            self.test_transmutation_create()
            self.test_transmutation_active()
            self.test_transmutation_stats()
            self.test_coach_prompts_remaining()
            self.test_coach_chat()
            self.test_subscription_checkout()
        
        print("=" * 60)
        print(f"📊 Tests completed: {self.tests_passed}/{self.tests_run} passed")
        
        # Save results
        with open('/app/backend_test_results.json', 'w') as f:
            json.dump({
                'summary': f"{self.tests_passed}/{self.tests_run} tests passed",
                'results': self.test_results,
                'timestamp': datetime.now().isoformat()
            }, f, indent=2)
        
        # Cleanup
        self.cleanup_test_data()
        
        return self.tests_passed == self.tests_run

if __name__ == "__main__":
    tester = PathfinderDSMTester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)