export default {
  template: `
    <div class="container my-4">
      <h2 class="mb-4">Requests</h2>
      
      <!-- Table for All Requests -->
      <div v-if="requests.length > 0">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>eBook ID</th>
              <th>Request Date</th>
              <th>Status</th>
              <th>User ID</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="request in requests" :key="request.request_id">
              <td>{{ request.ebook_id }}</td>
              <td>{{ request.request_date }}</td>
              <td>{{ request.status }}</td>
              <td>{{ request.user_id }}</td>
              <td>
                <button 
                  v-if="request.status === 'pending'" 
                  class="btn btn-success me-2" 
                  @click="grantRequest(request.request_id)">Grant
                </button>
                <button 
                  v-if="request.status === 'pending' || request.status === 'issued'" 
                  class="btn btn-danger" 
                  @click="revokeRequest(request.request_id)">Revoke
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else>
        <p>No requests available.</p>
      </div>
      
      <!-- Error Message -->
      <div v-if="error" class="alert alert-danger">{{ error }}</div>
    </div>
  `,
  data() {
    return {
      requests: [], 
      error: null
    };
  },
  mounted() {
    this.fetchRequests();
  },
  methods: {
    fetchRequests() {
      fetch('/requests')
        .then(response => response.json())
        .then(data => {
          console.log('Fetched requests data:', data); // Check the data structure
          this.requests = data;
        })
        .catch(error => {
          console.error('Error fetching requests:', error);
          this.error = 'Failed to load requests.';
        });
    },
    grantRequest(requestId) {
      fetch(`/requests/${requestId}/grant`, {
        method: 'PUT',
        headers: {
          'Authentication-Token': localStorage.getItem('token')
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to grant request.');
        }
        return response.json();
      })
      .then(() => {
        this.fetchRequests(); // Refresh data after granting
      })
      .catch(error => {
        console.error('Error granting request:', error);
        this.error = 'Failed to grant request.';
      });
    },
    revokeRequest(requestId) {
      fetch(`/requests/${requestId}/revoke`, {
        method: 'PUT',
        headers: {
          'Authentication-Token': localStorage.getItem('token')
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to revoke request.');
        }
        return response.json();
      })
      .then(() => {
        this.fetchRequests(); // Refresh data after revoking
      })
      .catch(error => {
        console.error('Error revoking request:', error);
        this.error = 'Failed to revoke request.';
      });
    }
  }
};
