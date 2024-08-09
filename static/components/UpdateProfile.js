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
          error: ''
        };
      },
      methods: {
        updateProfile() {
          fetch('/api/user/update', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ email: this.email, password: this.password })
          })
          .then(response => {
            if (!response.ok) {
              throw new Error('Update failed');
            }
            return response.json();
          })
          .then(data => {
            alert('Profile updated successfully');
          })
          .catch(error => {
            console.error('Update error:', error);
            this.error = 'An error occurred during profile update';
          });
        }
      },
      mounted() {
        // Fetch current user details and populate form fields
        fetch('/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        .then(response => response.json())
        .then(data => {
          this.email = data.email;
        })
        .catch(error => console.error('Error fetching user profile:', error));
      }
  };
  