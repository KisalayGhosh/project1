export default {
    template: `
      <div>
        <h2>Requests</h2>
        <ul>
          <li v-for="request in requests" :key="request.id">
            {{ request.ebook.title }} - {{ request.status }}
          </li>
        </ul>
      </div>
    `,
    data() {
      return {
        requests: []
      }
    },
    created() {
      fetch('http://127.0.0.1:5000/api/requests')
        .then(response => response.json())
        .then(data => {
          this.requests = data;
        })
    }
  }
  