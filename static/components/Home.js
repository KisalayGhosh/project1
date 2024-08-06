export default {
    template: `
      <div class="container my-4">
        <h2 class="mb-4">Dashboard Summary</h2>
        
        <div class="row">
          <div class="col-md-4">
            <div class="card text-white bg-primary mb-3" @mouseover="hover = true" @mouseleave="hover = false" :class="{ 'hover-card': hover }">
              <div class="card-body">
                <h5 class="card-title">Total Sections</h5>
                <p class="card-text">{{ summary.total_sections }}</p>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card text-white bg-success mb-3" @mouseover="hover = true" @mouseleave="hover = false" :class="{ 'hover-card': hover }">
              <div class="card-body">
                <h5 class="card-title">Total eBooks</h5>
                <p class="card-text">{{ summary.total_ebooks }}</p>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card text-white bg-danger mb-3" @mouseover="hover = true" @mouseleave="hover = false" :class="{ 'hover-card': hover }">
              <div class="card-body">
                <h5 class="card-title">Total Issued eBooks</h5>
                <p class="card-text">{{ summary.total_issued_ebooks }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
    data() {
      return {
        summary: {
          total_sections: 0,
          total_ebooks: 0,
          total_issued_ebooks: 0
        },
        hover: false
      };
    },
    mounted() {
      this.fetchSummary();
    },
    methods: {
      fetchSummary() {
        fetch('/dashboard/summary')
          .then(response => response.json())
          .then(data => {
            this.summary = data;
          })
          .catch(error => {
            console.error('Error fetching summary:', error);
          });
      }
    }
  };
  