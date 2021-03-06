import unittest
import requests

class playTest(unittest.TestCase):


    def test_get(self):
        response = requests.get("http://0.0.0.0:8080/")
        assert response.status_code == 200

    def test_delete(self):
        response = requests.delete("http://0.0.0.0:8080/api/student/Easter")
        assert response.status_code == 200


if __name__ == '__main__':
    unittest.main()
