import pytest
from app import app

@pytest.fixture
def client():
    with app.test_client() as client:
        yield client

def test_index_page(client):
    """Test if the index page returns HTTP status 200."""
    rv = client.get('/')
    assert rv.status_code == 200

def test_login(client):
    """Test user login functionality."""
    rv = client.post('/login', data=dict(
        username='testuser',
        password='testpassword'
    ), follow_redirects=True)
    assert b'Login successful' in rv.data
    


