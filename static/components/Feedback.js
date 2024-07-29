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
          <tr v-for="feedback in feedbackList" :key="feedback.feedback_id">
            <td>{{ feedback.ebook_title }}</td>
            <td>{{ feedback.user_email }}</td>
            <td>{{ feedback.comment }}</td>
            <td>{{ feedback.rating }}</td>
            <td>
              <button @click="deleteFeedback(feedback.feedback_id)" class="btn btn-danger btn-sm">
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
      feedbackList: [],
    };
  },
  created() {
    this.fetchFeedbacks();
  },
  methods: {
    fetchFeedbacks() {
      fetch('/api/feedbacks')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          this.feedbackList = data;
        })
        .catch(error => {
          console.error('Error fetching feedbacks:', error);
        });
    },
    deleteFeedback(feedbackId) {
      fetch(`/api/feedbacks/${feedbackId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          this.feedbackList = this.feedbackList.filter(feedback => feedback.feedback_id !== feedbackId);
        })
        .catch(error => {
          console.error('Error deleting feedback:', error);
        });
    }
  }
};
