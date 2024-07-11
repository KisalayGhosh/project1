export default {
    template: `
      <div>
        <h2>Issued Ebooks</h2>
        <ul>
          <li v-for="issuedEbook in issuedEbooks" :key="issuedEbook.id">
            {{ issuedEbook.ebook.title }} - {{ issuedEbook.status }}
          </li>
        </ul>
      </div>
    `,
    data() {
      return {
        issuedEbooks: []
      }
    },
    created() {
      fetch('http://127.0.0.1:5000/api/issued_ebooks')
        .then(response => response.json())
        .then(data => {
          this.issuedEbooks = data;
        })
    }
  }
  