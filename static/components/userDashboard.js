export default {
  template: `
    <div class="container my-4">
      <h5 class="mb-4">User Dashboard</h5>
      <div class="row">
        <div class="col-md-4" v-for="book in issuedBooks" :key="book.id">
          <div class="card mb-4">
            <div class="card-body">
              <h5 class="card-title">{{ book.title }}</h5>
              <p class="card-text">Author: {{ book.author }}</p>
              <p class="card-text">Section: {{ book.section }}</p>
              <p class="card-text">Issued Date: {{ book.issuedDate }}</p>
              <p class="card-text">Return Date: {{ book.returnDate }}</p>
              <p class="card-text">Content: {{ book.content }}</p>
              <button class="btn btn-primary" @click="openFeedbackModal(book.id)">Give Feedback</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Feedback Modal -->
      <div class="modal fade" id="feedbackModal" tabindex="-1" aria-labelledby="feedbackModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="feedbackModalLabel">Give Feedback</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="submitFeedback">
                <div class="mb-3">
                  <label for="rating" class="form-label">Rating</label>
                  <input type="number" id="rating" class="form-control" v-model="feedback.rating" min="1" max="5" required>
                </div>
                <div class="mb-3">
                  <label for="comment" class="form-label">Comment</label>
                  <textarea id="comment" class="form-control" v-model="feedback.comment" required></textarea>
                </div>
                <button type="submit" class="btn btn-success">Submit Feedback</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      issuedBooks: [
        {
          id: 1,
          title: 'Book Title 1',
          author: 'Author 1',
          section: 'Science',
          issuedDate: '2024-07-10',
          returnDate: '2024-08-10',
          content: 'Detailed content about the book...'
        },
        {
          id: 2,
          title: 'Book Title 2',
          author: 'Author 2',
          section: 'Philosophy',
          issuedDate: '2024-07-15',
          returnDate: '2024-08-15',
          content: 'Detailed content about the book...'
        }
      ],
      feedback: {
        bookId: null,
        rating: '',
        comment: ''
      }
    };
  },
  methods: {
    openFeedbackModal(bookId) {
      this.feedback.bookId = bookId;
      new bootstrap.Modal(document.getElementById('feedbackModal')).show();
    },
    async submitFeedback() {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`/feedback`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(this.feedback)
        });
        if (!response.ok) {
          throw new Error('Failed to submit feedback.');
        }
        // Reset feedback data and hide modal
        this.feedback = { bookId: null, rating: '', comment: '' };
        bootstrap.Modal.getInstance(document.getElementById('feedbackModal')).hide();
      } catch (error) {
        console.error('Error submitting feedback:', error);
        // Handle feedback submission error
      }
    }
  }
};
