export default {
  props: ['sectionId'],
  template: `
    <div class="container my-4">
      <h2 class="mb-4">Available Ebooks for Section {{ sectionName }}</h2>
      <div v-if="error" class="alert alert-danger">{{ error }}</div>
      <table class="table table-striped" v-if="availableEbooks.length > 0">
        <thead>
          <tr>
            <th>Book Title</th>
            <th>Author</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ebook in availableEbooks" :key="ebook.id">
            <td>{{ ebook.title }}</td>
            <td>{{ ebook.author }}</td>
            <td>
              <button class="btn btn-primary" @click="requestEbook(ebook.id)">Request</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="alert alert-info">No ebooks available for this section.</div>
    </div>
  `,
  data() {
    return {
      availableEbooks: [],
      sectionName: '',
      error: null,
    };
  },
  created() {
    this.fetchAvailableEbooks();
  },
  methods: {
    async fetchAvailableEbooks() {
      try {
        const response = await fetch(`http://127.0.0.1:5000/sections/${this.sectionId}/ebooks`);
        if (!response.ok) {
          throw new Error('Failed to fetch available ebooks.');
        }
        const data = await response.json();
        this.availableEbooks = data.ebooks;
        this.sectionName = data.section_name;
      } catch (error) {
        console.error('Error fetching available ebooks:', error);
        this.error = 'Failed to load ebooks.';
      }
    },
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
        alert('Ebook requested successfully!');
      } catch (error) {
        console.error('Error requesting ebook:', error);
        this.error = 'Failed to request ebook.';
      }
    }
  },
  watch: {
    sectionId: 'fetchAvailableEbooks' // Watch for changes to sectionId and refetch ebooks
  }
};
