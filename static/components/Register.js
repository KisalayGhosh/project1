export default {
    template: `
      <div class="container">
    <div class="row justify-content-center mt-5">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header bg-primary text-white">
            <h4 class="card-title">Register</h4>
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
          email: '',
          password: '',
          error: ''
        };
      },
      methods: {
        register() {
          fetch('/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: this.email, password: this.password })
          })
          .then(response => {
            if (!response.ok) {
              throw new Error('Registration failed');
            }
            return response.json();
          })
          .then(data => {
            this.$router.push('/login');
          })
          .catch(error => {
            console.error('Registration error:', error);
            this.error = 'An error occurred during registration';
          });
        }
      }
  };
  