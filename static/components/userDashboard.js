import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default {
  template: `
    <div class="container my-4">
      <h2 class="mb-4">Dashboard Summary</h2>
      
      <div class="row">
        <!-- Summary Cards -->
      </div>

      <div class="row mt-5">
        <div class="col-md-12">
          <BarChart :chartData="chartData" :chartOptions="chartOptions"></BarChart>
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
      hover: false,
      chartData: {
        labels: ['Total Sections', 'Total eBooks', 'Total Issued eBooks'],
        datasets: [
          {
            label: 'Count',
            backgroundColor: ['#42A5F5', '#66BB6A', '#EF5350'],
            data: []
          }
        ]
      },
      chartOptions: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(tooltipItem) {
                return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
              }
            }
          }
        }
      }
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
          this.updateChartData(data);
        })
        .catch(error => {
          console.error('Error fetching summary:', error);
        });
    },
    updateChartData(data) {
      this.chartData.datasets[0].data = [
        data.total_sections,
        data.total_ebooks,
        data.total_issued_ebooks
      ];
    }
  },
  components: {
    BarChart: Bar
  }
};