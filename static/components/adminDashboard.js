export default {
    template: `
        <div class="container mt-5">
            <h2>Admin Dashboard</h2>
            <h3>All Users</h3>
            <ul>
                <li v-for="user in users" :key="user.id">{{ user.email }}</li>
            </ul>
            <h3>All Ebooks</h3>
            <ul>
                <li v-for="ebook in ebooks" :key="ebook.id">{{ ebook.title }} by {{ ebook.author }}</li>
            </ul>
        </div>
    `,
    data() {
        return {
            users: [],
            ebooks: []
        };
    },
    mounted() {
        axios.get('/users')
            .then(response => {
                this.users = response.data;
            })
            .catch(error => {
                console.error('Error fetching users:', error);
                alert('Failed to fetch users.');
            });

        axios.get('/ebooks')
            .then(response => {
                this.ebooks = response.data;
            })
            .catch(error => {
                console.error('Error fetching ebooks:', error);
                alert('Failed to fetch ebooks.');
            });
    }
};
