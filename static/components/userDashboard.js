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
                  <textarea id="comment" class="form-control" v-model="feedback.comment" rows="3" required></textarea>
                </div>
                <button type="submit" class="btn btn-primary">Submit</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      issuedBooks: [],
      feedback: {
        bookId: null,
        rating: null,
        comment: ''
      }
    };
  },
  methods: {
    fetchIssuedBooks() {
      fetch('/api/issued-books', {
        headers: {
          'Authentication-Token': localStorage.getItem('token') 
        }
      })
        .then(response => response.json())
        .then(data => {
          this.issuedBooks = data;
        })
        .catch(error => console.error('Error fetching issued books:', error));
    },
    openFeedbackModal(bookId) {
      this.feedback.bookId = bookId;
      const feedbackModal = new bootstrap.Modal(document.getElementById('feedbackModal'));
      feedbackModal.show();
    },
    submitFeedback() {
      const userId = 1; 
      fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authentication-Token': localStorage.getItem('token') 
        },
        body: JSON.stringify({
          userId: userId,
          bookId: this.feedback.bookId,
          rating: this.feedback.rating,
          comment: this.feedback.comment
        })
      })
        .then(response => response.json())
        .then(data => {
          console.log('Feedback submitted:', data);
          const feedbackModal = new bootstrap.Modal(document.getElementById('feedbackModal'));
          feedbackModal.hide();
        })
        .catch(error => console.error('Error submitting feedback:', error));
    }
  },
  mounted() {
    this.fetchIssuedBooks();
  }
};
