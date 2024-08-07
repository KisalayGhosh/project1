import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default {
  name: 'UserDashboardChart',
  components: {
    BarChart: Bar
  },
  data() {
    return {
      chartData: {
        labels: [], // Array of labels for the x-axis (e.g., user names)
        datasets: [
          {
            label: 'Ebooks Downloaded',
            backgroundColor: '#FF6384',
            borderColor: '#FF6384',
            data: [] // Array of data points (e.g., number of ebooks downloaded per user)
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
        const response = await fetch('/api/user/activity-stats'); // Replace with your API endpoint
        const data = await response.json();
        this.chartData.labels = data.labels; // Array of labels (e.g., user names)
        this.chartData.datasets[0].data = data.values; // Array of data points (e.g., number of ebooks downloaded per user)
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    }
  }
};
