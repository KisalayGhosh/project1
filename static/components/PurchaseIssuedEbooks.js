export default {
  template: `
      <div class="container">
          <div class="row mt-5">
              <div class="col-12">
                  <h2>Your Issued E-books</h2>
                  <div class="row">
                      <div class="col-md-4" v-for="ebook in issuedEbooks" :key="ebook.issue_id">
                          <div class="card mb-3">
                              <div class="card-body">
                                  <h5 class="card-title">{{ ebook.title }}</h5>
                                  <p class="card-text">Status: {{ ebook.status }}</p>
                                  <p class="card-text">Price: {{ ebook.price }}</p>
                                  <p class="card-text" v-if="ebook.purchased">Purchased: Yes</p>
                                  <button v-if="!ebook.purchased" @click="purchaseEbook(ebook.issue_id)" class="btn btn-primary">Purchase</button>
                                  <p class="text-success mt-2" v-if="ebook.purchased">Purchase Successful</p>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  `,
  data() {
      return {
          issuedEbooks: []
      };
  },
  created() {
      this.fetchIssuedEbooks();
  },
  methods: {
      fetchIssuedEbooks() {
          const userId = localStorage.getItem('user_id'); // Fetch user_id from localStorage
          fetch(`http://127.0.0.1:5000/issued_ebooks?user_id=${userId}`)
              .then(response => response.json())
              .then(data => {
                  this.issuedEbooks = data.map(ebook => ({
                      ...ebook,
                      price: ebook.price || 0.0 // Ensure price is included
                  }));
              })
              .catch(error => {
                  console.error('Error fetching issued ebooks:', error);
              });
      },
      purchaseEbook(issueId) {
          fetch(`http://127.0.0.1:5000/purchase/${issueId}`, {
              method: 'POST'
          })
              .then(response => response.json())
              .then(data => {
                  if (data.message === 'Purchase successful') {
                      const ebook = this.issuedEbooks.find(e => e.issue_id === issueId);
                      if (ebook) {
                          ebook.purchased = true;
                      }
                  } else {
                      alert(data.message);
                  }
              })
              .catch(error => {
                  console.error('Error purchasing ebook:', error);
              });
      }
  }
};
