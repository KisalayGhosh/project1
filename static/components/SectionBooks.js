export default {
  template: `
    <div>
      <h1 class="m-5">Books in Section: {{ sectionName }}</h1>
      <div class="row m-5">
        <div class="col-lg-4 col-md-6 col-sm-12" v-for="book in books" :key="book.id">
          <div class="card m-3">
            <div class="card-body">
              <h5 class="card-title">{{ book.title }}</h5>
              <p class="card-text">Author: {{ book.author }}</p>
              <p class="card-text">{{ book.content }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      sectionName: '',
      books: []
    };
  },
  mounted() {
    this.fetchBooks();
  },
  methods: {
    async fetchBooks() {
      const sectionId = this.$route.params.sectionId;
      try {
        const response = await fetch(`/sections/${sectionId}/ebooks`);
        if (!response.ok) {
          throw new Error('Failed to fetch books.');
        }
        const data = await response.json();
        this.sectionName = data.section_name;
        this.books = data.ebooks;
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    }
  }
};
