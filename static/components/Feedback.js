export default {
    template: `
      <div>
        <h2>Feedback</h2>
        <ul>
          <li v-for="feedback in feedbackList" :key="feedback.id">
            {{ feedback.comment }} - {{ feedback.rating }}
          </li>
        </ul>
      </div>
    `,
    data() {
      return {
        feedbackList: []
      }
    },
    created() {
      fetch('http://127.0.0.1:5000/api/feedback')
        .then(response => response.json())
        .then(data => {
          this.feedbackList = data;
        })
    }
  }
  