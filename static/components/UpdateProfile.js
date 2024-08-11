export default {
  template: `
    <div class="container">
      <div class="row justify-content-center mt-5">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header bg-primary text-white">
              <h4 class="card-title">Update Profile</h4>
            </div>
            <div class="card-body">
              <form @submit.prevent="updateProfile">
                <div class="form-group">
                  <label for="email">Email address</label>
                  <input type="email" class="form-control" id="email" v-model="email">
                </div>
                <div class="form-group">
                  <label for="password">New Password</label>
                  <input type="password" class="form-control" id="password" v-model="password">
                </div>
                <button type="submit" class="mt-2 btn btn-primary btn-block">Update</button>
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
      error: null
    };
  },
  mounted() {
    this.fetchUser();
  },
  methods: {
    async fetchUser() {
      try {
        const response = await fetch('/api/user', {
          method: 'GET',
          headers: {
            'Authentication-Token': localStorage.getItem('token')
          }
        });
        const data = await response.json();
        if (response.ok) {
          this.email = data.email;
        } else {
          this.error = data.error;
        }
      } catch (error) {
        this.error = 'Failed to fetch user details';
      }
    },
    async updateProfile() {
      this.error = null;
      try {
        const response = await fetch('/api/user', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authentication-Token': localStorage.getItem('token')
          },
          body: JSON.stringify({
            email: this.email,
            password: this.password
          })
        });
        const data = await response.json();
        if (response.ok) {
          alert('Profile updated successfully');
        } else {
          this.error = data.error;
        }
      } catch (error) {
        this.error = 'Failed to update profile';
      }
    }
  }
};