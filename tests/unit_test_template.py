import unittest
import requests

class playTest(unittest.TestCase):

    #this is just to include a test in the CI/CD pipeline for the purpose of CI/CD tutoring
    def test_home(self):
        response = requests.get("http://google.com")
        assert response.status_code == 200

    def test_upper(self):
        self.assertEqual('foo'.upper(), 'FOO')

    def test_isupper(self):
        self.assertTrue('FOO'.isupper())
        self.assertFalse('Foo'.isupper())



if __name__ == '__main__':
    unittest.main()
