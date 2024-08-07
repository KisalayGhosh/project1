export default {
  template: `
    <div class="container my-4">
      <h2 class="mb-4">Available Ebooks</h2>
      <div v-if="error" class="alert alert-danger">{{ error }}</div>
      <div v-if="success" class="alert alert-success">{{ success }}</div>
      <table class="table table-striped" v-if="availableEbooks.length > 0">
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
          <tr v-for="ebook in availableEbooks" :key="ebook.id">
            <td>{{ ebook.title }}</td>
            <td>{{ ebook.author }}</td>
            <td>{{ ebook.section_name }}</td>
            <td>{{ ebook.price }}</td>
            <td>
              <button class="btn btn-primary" @click="purchaseEbook(ebook.id)">Purchase</button>
              <button class="btn btn-secondary" @click="downloadEbook(ebook.id)" v-if="purchasedEbooks.includes(ebook.id)">Download</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="alert alert-info">No ebooks available.</div>
    </div>
  `,
  data() {
    return {
      availableEbooks: [],
      purchasedEbooks: [], // Track purchased e-books
      error: null,
      success: null,
    };
  },
  created() {
    this.fetchAvailableEbooks();
    this.fetchPurchasedEbooks();
  },
  methods: {
    async fetchAvailableEbooks() {
      try {
        const response = await fetch('/ebooks');
        if (!response.ok) throw new Error('Failed to fetch available ebooks.');
        const data = await response.json();
        this.availableEbooks = data;
      } catch (error) {
        this.error = 'Failed to load ebooks.';
      }
    },
    async fetchPurchasedEbooks() {
      try {
        const response = await fetch('/purchase', {
          headers: {
            'Authentication-Token': localStorage.getItem('token'),
          },
        });
        if (!response.ok) throw new Error('Failed to fetch purchased ebooks.');
        const data = await response.json();
        this.purchasedEbooks = data.map(p => p.ebook_id);
      } catch (error) {
        this.error = 'Failed to load purchased ebooks.';
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
        this.fetchPurchasedEbooks(); // Refresh purchased ebooks list
        setTimeout(() => { this.success = null; }, 3000);

      } catch (error) {
        this.error = 'Failed to purchase ebook.';
      }
    },
    async downloadEbook(ebookId) {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const response = await fetch(`/download/${ebookId}?user_id=${this.userId}`, {
          headers: {
            'Authentication-Token': token,
          },
        });

        if (!response.ok) throw new Error('Failed to download ebook.');

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${ebookId}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      } catch (error) {
        this.error = 'Failed to download ebook.';
      }
    },
  },
};
