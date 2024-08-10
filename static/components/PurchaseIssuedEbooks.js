export default {
  template: `
    <div>
      <h2>Issued E-Books</h2>
      <ul>
        <li v-for="ebook in issuedEbooks" :key="ebook.issue_id">
          <span>{{ ebook.title }} - Status: {{ ebook.status }}</span>
          <button v-if="!ebook.purchased" @click="purchaseEbook(ebook.issue_id)">Purchase</button>
          <span v-else>Purchased</span>
        </li>
      </ul>
    </div>
  `,
  data() {
    return {
      issuedEbooks: []
    };
  },
  methods: {
    fetchIssuedEbooks() {
      // Replace with your API endpoint
      fetch(`/api/issued_ebooks?user_id=${this.$store.state.userId}`)
        .then(response => response.json())
        .then(data => {
          this.issuedEbooks = data;
        })
        .catch(error => {
          console.error('Error fetching issued e-books:', error);
        });
    },
    purchaseEbook(issueId) {
      fetch(`/api/purchase/${issueId}`, { method: 'POST' })
        .then(response => response.json())
        .then(data => {
          if (data.message === 'Purchase successful') {
            this.fetchIssuedEbooks(); // Refresh the list
          } else {
            alert(data.message);
          }
        })
        .catch(error => {
          console.error('Error purchasing e-book:', error);
        });
    }
  },
  created() {
    this.fetchIssuedEbooks();
  }
};
