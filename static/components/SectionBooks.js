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
              <div class="text-end">
                <button @click="editBook(book)" class="btn btn-primary">
                  <i class="fas fa-edit"></i> Edit
                </button>
                <button @click="deleteBook(book.id)" class="btn btn-danger">
                  <i class="fas fa-trash"></i> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Edit Modal -->
      <div v-if="showEditModal" class="modal fade show" style="display: block;" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Edit eBook</h5>
              <button type="button" class="close" @click="closeEditModal" aria-label="Close" style="position: absolute; right: 15px; top: 15px;">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="submitEdit">
                <div class="form-group">
                  <label for="title">Title</label>
                  <input type="text" v-model="editForm.title" class="form-control" required />
                </div>
                <div class="form-group">
                  <label for="author">Author</label>
                  <input type="text" v-model="editForm.author" class="form-control" required />
                </div>
                <div class="form-group mb-3">
                  <label for="content">Content</label>
                  <textarea v-model="editForm.content" class="form-control" required></textarea>
                </div>
                <div class="text-end">
                  <button type="submit" class="btn btn-success">Save changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      sectionName: '',
      books: [],
      showEditModal: false,
      editForm: {
        id: null,
        title: '',
        author: '',
        content: ''
      }
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
    },
    editBook(book) {
      this.editForm = { ...book };
      this.showEditModal = true;
    },
    closeEditModal() {
      this.showEditModal = false;
    },
    async submitEdit() {
      try {
        const response = await fetch(`/sections/${this.$route.params.sectionId}/ebooks/${this.editForm.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.editForm)
        });
        if (!response.ok) {
          throw new Error('Failed to update book.');
        }
        this.closeEditModal();
        this.fetchBooks();
      } catch (error) {
        console.error('Error updating book:', error);
      }
    },
    async deleteBook(bookId) {
      const sectionId = this.$route.params.sectionId;
      try {
        const response = await fetch(`/sections/${sectionId}/ebooks/${bookId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete book.');
        }
        this.fetchBooks(); // Refresh the list after deletion
      } catch (error) {
        console.error('Error deleting book:', error);
      }
    }
  }
};
