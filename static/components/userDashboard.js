export default {
  template: `
    <div class="container my-4">
      <h5 class="mb-4">User Dashboard</h5>
      
      <div class="row mb-4">
        <div class="col-md-6">
          <label for="reportMonth">Select Month</label>
          <input type="month" id="reportMonth" v-model="selectedMonth" class="form-control">
        </div>
        <div class="col-md-6 d-flex align-items-end">
          <button class="btn btn-primary me-2" @click="downloadReport('html')">Download HTML Report</button>
          <button class="btn btn-secondary" @click="downloadReport('pdf')">Download PDF Report</button>
        </div>
      </div>
      
      <div class="row">
        <div class="col-md-4" v-for="book in issuedBooks" :key="book.id">
          <div class="card mb-4">
            <div class="card-body">
              <h5 class="card-title">{{ book.title }}</h5>
              <p class="card-text">Author: {{ book.author }}</p>
              <p class="card-text">Section: {{ book.section }}</p>
              <p class="card-text">Issued Date: {{ book.issuedDate }}</p>
              <p class="card-text">Return Date: {{ book.returnDate }}</p>
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
      },
      userId: null,
      selectedMonth: null,
      error: null
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
    fetchUserId() {
      fetch('/api/user-id', {
        headers: {
          'Authentication-Token': localStorage.getItem('token')
        }
      })
        .then(response => response.json())
        .then(data => {
          this.userId = data.user_id;
        })
        .catch(error => console.error('Error fetching user ID:', error));
    },
    openFeedbackModal(bookId) {
      this.feedback.bookId = bookId;
      const feedbackModal = new bootstrap.Modal(document.getElementById('feedbackModal'));
      feedbackModal.show();
    },
    submitFeedback() {
      if (!this.userId) {
        console.error('User ID is not available');
        return;
      }

      fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authentication-Token': localStorage.getItem('token')
        },
        body: JSON.stringify({
          user_id: this.userId,
          ebook_id: this.feedback.bookId,
          rating: this.feedback.rating,
          comment: this.feedback.comment
        })
      })
        .then(response => response.json())
        .then(data => {
          console.log('Feedback submitted:', data);
          const feedbackModal = bootstrap.Modal.getInstance(document.getElementById('feedbackModal'));
          feedbackModal.hide();
          this.feedback = {
            bookId: null,
            rating: null,
            comment: ''
          };
        })
        .catch(error => console.error('Error submitting feedback:', error));
    },
    async downloadReport(format) {
      try {
        if (!this.selectedMonth) {
          this.error = 'Please select a month.';
          return;
        }

        const response = await fetch('/generate-report', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authentication-Token': localStorage.getItem('token')
          },
          body: JSON.stringify({
            user_id: this.userId,
            month: this.selectedMonth,
            format: format
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to generate report.');
        }

        if (format === 'html') {
          const reportHtml = await response.text();
          const blob = new Blob([reportHtml], { type: 'text/html' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'report.html';
          a.click();
        } else if (format === 'pdf') {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'report.pdf';
          a.click();
        }

      } catch (error) {
        console.error('Error downloading report:', error);
        this.error = 'Failed to download report.';
      }
    }
  },
  mounted() {
    this.fetchIssuedBooks();
    this.fetchUserId();
  }
};
