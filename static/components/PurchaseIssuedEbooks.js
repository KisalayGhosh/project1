export default {
    template: `
      <div class="container my-4">
        <h2 class="mb-4">Purchase Issued Ebooks</h2>
        <div v-if="error" class="alert alert-danger">{{ error }}</div>
        <div v-if="success" class="alert alert-success">{{ success }}</div>
        <table class="table table-striped" v-if="issuedEbooks.length > 0">
          <thead>
            <tr>
              <th>Book Title</th>
              <th>Author</th>
              <th>Section</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="ebook in issuedEbooks" :key="ebook.id">
              <td>{{ ebook.title }}</td>
              <td>{{ ebook.author }}</td>
              <td>{{ ebook.section_name }}</td>
              <td>{{ ebook.price }}</td>
              <td>
                <button class="btn btn-primary" @click="purchaseEbook(ebook.id)">Purchase</button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else class="alert alert-info">No issued ebooks available for purchase.</div>
      </div>
    `,
    data() {
      return {
        issuedEbooks: [],
        error: null,
        success: null,
      };
    },
    created() {
      this.fetchIssuedEbooks();
    },
    methods: {
      async fetchIssuedEbooks() {
        try {
          const response = await fetch('/api/issued-books', {
            headers: { 
                'Authorization': `Bearer ${token}`,

            },
          });
          if (!response.ok) {
            throw new Error('Failed to fetch issued ebooks.');
          }
          const data = await response.json();
          this.issuedEbooks = data;
        } catch (error) {
          console.error('Error fetching issued ebooks:', error);
          this.error = 'Failed to load issued ebooks.';
        }
      },
      async purchaseEbook(ebookId) {
        try {
          const token = localStorage.getItem('token');
          if (!token) throw new Error('No token found');
  
          const response = await fetch('/purchases', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authentication-Token': token,
            },
            body: JSON.stringify({ ebook_id: ebookId }),
          });
  
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to purchase ebook.');
          }
  
          this.success = 'Ebook purchased successfully!';
          setTimeout(() => { this.success = null; }, 3000); // Hide success message after 3 seconds
  
        } catch (error) {
          console.error('Error purchasing ebook:', error);
          this.error = 'Failed to purchase ebook.';
        }
      }
    }
  };
  