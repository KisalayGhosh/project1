export default {
    template: `
      <div>
        <h2>User Ebook Requests</h2>
        <div class="row">
          <div class="col-lg-4 col-md-6 col-sm-12" v-for="request in requests" :key="request.request_id">
            <div class="card mb-3">
              <div class="card-body">
                <h5 class="card-title">{{ request.ebook.title }}</h5>
                <p class="card-text">Author: {{ request.ebook.author }}</p>
                <p class="card-text">Section: {{ getSectionName(request.ebook.ebook_id) }}</p>
                <p class="card-text">Requested by: {{ request.user.email }}</p>
                <button class="btn btn-success me-2" @click="grantRequest(request.request_id)">Grant</button>
                <button class="btn btn-danger" @click="revokeRequest(request.request_id)">Revoke</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
    data() {
      return {
        requests: [],
        sections: [], // To store section information
        error: null
      };
    },
    mounted() {
      this.fetchRequests();
      this.fetchSections(); // Fetch sections on component mount
    },
    methods: {
      async fetchRequests() {
        try {
          const response = await fetch('/requests');
          if (!response.ok) {
            throw new Error('Failed to fetch requests.');
          }
          const data = await response.json();
          this.requests = data;
        } catch (error) {
          console.error('Error fetching requests:', error);
          this.error = 'Failed to load requests.';
        }
      },
      async fetchSections() {
        try {
          const response = await fetch('/sections'); // Replace with your endpoint to fetch sections
          if (!response.ok) {
            throw new Error('Failed to fetch sections.');
          }
          const data = await response.json();
          this.sections = data;
        } catch (error) {
          console.error('Error fetching sections:', error);
          this.error = 'Failed to load sections.';
        }
      },
      getSectionName(ebookId) {
        const ebook = this.requests.find(request => request.ebook.ebook_id === ebookId);
        if (ebook) {
          const section = this.sections.find(section => section.ebook_id === ebook.ebook.ebook_id);
          return section ? section.section_name : 'N/A';
        }
        return 'N/A';
      },
      async grantRequest(requestId) {
        try {
          const token = localStorage.getItem('auth_token');
          const response = await fetch(`/requests/${requestId}/grant`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (!response.ok) {
            throw new Error('Failed to grant request.');
          }
          this.requests = this.requests.filter(request => request.request_id !== requestId);
        } catch (error) {
          console.error('Error granting request:', error);
          this.error = 'Failed to grant request.';
        }
      },
      async revokeRequest(requestId) {
        try {
          const token = localStorage.getItem('auth_token');
          const response = await fetch(`/requests/${requestId}/revoke`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (!response.ok) {
            throw new Error('Failed to revoke request.');
          }
          this.requests = this.requests.filter(request => request.request_id !== requestId);
        } catch (error) {
          console.error('Error revoking request:', error);
          this.error = 'Failed to revoke request.';
        }
      }
    }
  };
