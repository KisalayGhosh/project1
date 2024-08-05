export default {
  template: `
    <div style="max-width: 100%; overflow-x: hidden;">
      <div class="row" style="max-width: 100%; overflow-x: hidden;">
        <div 
          class="col-lg-4 col-md-6 col-sm-12" 
          v-for="request in requests" 
          :key="request.request_id"
          style="max-width: 100%; overflow: hidden;"
        >
          <div class="card m-4" style="max-width: 100%; overflow: hidden;">
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
      sections: [],  
      error: null
    };
  },
  mounted() {
    this.fetchDemoData();
  },
  methods: {
    fetchDemoData() {
      fetch('/requests')
        .then(response => response.json())
        .then(data => {
          this.requests = data;
          // Fetch sections data for display
          return fetch('/sections');
        })
        .then(response => response.json())
        .then(data => {
          this.sections = data;
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          this.error = 'Failed to load data.';
        });
    },
    getSectionName(ebookId) {
      const section = this.sections.find(section => section.ebook_id === ebookId);
      return section ? section.section_name : 'N/A';
    },
    grantRequest(requestId) {
      fetch(`/requests/${requestId}/grant`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to grant request.');
        }
        return response.json();
      })
      .then(() => {
        this.requests = this.requests.filter(request => request.request_id !== requestId);
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
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to revoke request.');
        }
        return response.json();
      })
      .then(() => {
        this.requests = this.requests.filter(request => request.request_id !== requestId);
      })
      .catch(error => {
        console.error('Error revoking request:', error);
        this.error = 'Failed to revoke request.';
      });
    }
  }
};
