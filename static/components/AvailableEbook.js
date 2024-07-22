export default {
  template: `
    <div class="container my-4">
      <h2 class="mb-4">Available Ebooks</h2>
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Book Title</th>
            <th>Author</th>
            <th>Section</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ebook in availableEbooks" :key="ebook.id">
            <td>{{ ebook.title }}</td>
            <td>{{ ebook.author }}</td>
            <td>{{ ebook.section }}</td>
            <td>
              <button class="btn btn-primary" @click="requestEbook(ebook.id)">Request</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  data() {
    return {
      availableEbooks: [
        { id: 1, title: 'The Alchemist', author: 'Paule Coelho', section: 'Fantasy' },
        { id: 2, title: 'Harry Potter', author: 'J.K Rowling', section: 'Fantasy' },
        { id: 3, title: 'To Kill a Mockingbird', author: 'Harper Lee', section: 'Fiction' }
      ]
    };
  },
  created() {
    // this.fetchAvailableEbooks();
  },
  methods: {
    // Uncomment to use API for fetching available ebooks
    // async fetchAvailableEbooks() {
    //   try {
    //     const response = await fetch('http://127.0.0.1:5000/api/available_ebooks');
    //     if (!response.ok) {
    //       throw new Error('Failed to fetch available ebooks.');
    //     }
    //     const data = await response.json();
    //     this.availableEbooks = data;
    //   } catch (error) {
    //     console.error('Error fetching available ebooks:', error);
    //   }
    // },
    
    async requestEbook(ebookId) {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`/request_ebook/${ebookId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to request ebook.');
        }
        // Handle successful request, e.g., show a notification
        alert('Ebook requested successfully!');
      } catch (error) {
        console.error('Error requesting ebook:', error);
      }
    }
  }
};
