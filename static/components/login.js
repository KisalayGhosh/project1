export default {
    template: `
        <div class="container">
            <div class="row justify-content-center mt-5">
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header bg-primary text-white">
                            <h4 class="card-title">Login to Access Library</h4>
                        </div>
                        <div class="card-body">
                            <form @submit.prevent="login">
                                <div class="form-group">
                                    <label for="email">Email address</label>
                                    <input type="email" class="form-control" id="email" v-model="email" required>
                                </div>
                                <div class="form-group">
                                    <label for="password">Password</label>
                                    <input type="password" class="form-control" id="password" v-model="password" required>
                                </div>
                                <button type="submit" class="mt-2 btn btn-primary btn-block">Login</button>
                                <p class="text-danger mt-2" v-if="error">{{ error }}</p>
                            </form>
                            <div class="mt-3 text-center">
                                <button @click="goToRegister" class="btn btn-secondary">Register</button>
                            </div>
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
        login() {
            fetch('http://127.0.0.1:5000/user-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: this.email, password: this.password })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Login failed');
                }
                return response.json();
            })
            .then(data => {
                if (data.token) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('role', data.role);
                    localStorage.setItem('user_id',data.user_id) 
                    if (data.role === 'admin') {
                        this.$router.push('/admin/dashboard'); 
                    } else {
                        this.$router.push('/'); 
                    }
                    window.location.reload();
                } else {
                    this.error = data.message || 'Login failed';
                }
            })
            .catch(error => {
                console.error('Login error:', error);
                this.error = 'An error occurred during login';
            });
        },
        goToRegister() {
            this.$router.push('/register');
        }
    }
};
