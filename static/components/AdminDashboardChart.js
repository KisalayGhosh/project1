import { Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale);

export default {
  name: 'AdminDashboardChart',
  components: {
    LineChart: Line
  },
  data() {
    return {
      chartData: {
        labels: [], // Array of labels for the x-axis (e.g., months)
        datasets: [
          {
            label: 'Number of Ebooks Added',
            backgroundColor: '#42A5F5',
            borderColor: '#1E88E5',
            data: [] // Array of data points (e.g., number of ebooks added per month)
          }
        ]
      },
      chartOptions: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top'
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
    this.fetchChartData();
  },
  methods: {
    async fetchChartData() {
      try {
        const response = await fetch('/api/admin/ebooks-stats'); // Replace with your API endpoint
        const data = await response.json();
        this.chartData.labels = data.labels; // Array of labels (e.g., months)
        this.chartData.datasets[0].data = data.values; // Array of data points (e.g., number of ebooks added per month)
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    }
  }
};
