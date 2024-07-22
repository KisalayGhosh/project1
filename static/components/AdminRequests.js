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
      this.requests = [
        {
          request_id: 1,
          ebook: {
            ebook_id: 101,
            title: 'Book Title 1',
            author: 'Author 1'
          },
          user: {
            email: 'user1@example.com'
          }
        },
        {
          request_id: 2,
          ebook: {
            ebook_id: 102,
            title: 'Book Title 2',
            author: 'Author 2'
          },
          user: {
            email: 'user2@example.com'
          }
        }
      ];

      this.sections = [
        {
          ebook_id: 101,
          section_name: 'Section 1'
        },
        {
          ebook_id: 102,
          section_name: 'Section 2'
        }
      ];
    },
    getSectionName(ebookId) {
      const section = this.sections.find(section => section.ebook_id === ebookId);
      return section ? section.section_name : 'N/A';
    },
    grantRequest(requestId) {
      this.requests = this.requests.filter(request => request.request_id !== requestId);
    },
    revokeRequest(requestId) {
      this.requests = this.requests.filter(request => request.request_id !== requestId);
    }
  }
};
