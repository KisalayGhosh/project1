export default {
  template: `
    <div class="container">
      <div class="row justify-content-center mt-5">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header bg-primary text-white">
              <h4 class="card-title">Register for Library Access</h4>
            </div>
            <div class="card-body">
              <form @submit.prevent="register">
                <div class="form-group">
                  <label for="email">Email address</label>
                  <input type="email" class="form-control" id="email" v-model="email" required>
                </div>
                <div class="form-group">
                  <label for="password">Password</label>
                  <input type="password" class="form-control" id="password" v-model="password" required>
                </div>
                <div class="form-group">
                  <label for="username">Username</label>
                  <input type="text" class="form-control" id="username" v-model="username" required>
                </div>
  
                <div class="form-group">
                  <label for="role">Role</label>
                  <select class="form-control" id="role" v-model="role" required>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <button type="submit" class="mt-2 btn btn-primary btn-block">Register</button>
                <p class="text-danger mt-2" v-if="error">{{ error }}</p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      username: '',
      email: '',
      password: '',
      role: 'user',
      error: ''
    };
  },
  methods: {
    register() {
      fetch('http://127.0.0.1:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: this.username,
          email: this.email,
          password: this.password,
          role: this.role
        })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Registration failed');
        }
        return response.json();
      })
      .then(data => {
        if (data.message === 'User registered successfully') {
          this.$router.push('/login');
        } else {
          this.error = data.message || 'Registration failed';
        }
      })
      .catch(error => {
        console.error('Registration error:', error);
        this.error = 'An error occurred during registration';
      });
    }
  }
};
