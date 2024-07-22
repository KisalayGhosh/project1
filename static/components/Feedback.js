export default {
  template: `
    <div class="container my-4">
      <table class="table table-striped">
        <thead class="thead-dark">
          <tr>
            <th>Ebook Name</th>
            <th>Username</th>
            <th>Comment</th>
            <th>Rating</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="feedback in feedbackList" :key="feedback.id">
            <td>{{ feedback.ebookName }}</td>
            <td>{{ feedback.username }}</td>
            <td>{{ feedback.comment }}</td>
            <td>{{ feedback.rating }}</td>
            <td>
              <button @click="deleteFeedback(feedback.id)" class="btn btn-danger btn-sm">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  data() {
    return {
      feedbackList: [
        {
          id: 1,
          ebookName: 'Book Title 1',
          username: 'user1@example.com',
          comment: 'Great book!',
          rating: 5
        },
        {
          id: 2,
          ebookName: 'Book Title 2',
          username: 'user2@example.com',
          comment: 'Very informative.',
          rating: 4
        }
      ]
    };
  },
  methods: {
    deleteFeedback(feedbackId) {
      // Function to handle feedback deletion
      this.feedbackList = this.feedbackList.filter(feedback => feedback.id !== feedbackId);
    }
  }
};
