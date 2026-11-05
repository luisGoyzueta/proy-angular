import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { UserStore } from '../users/store/user-store';

@Component({
  selector: 'app-dashboard',
  imports: [DecimalPipe, ChartModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  ngOnInit(): void {
    this.userStore.loadUsers();
  }

  stats = [
    {
      title: 'Ventas totales',
      value: 45890,
      icon: 'pi pi-wallet',
      change: '+12.5%',
      currency: true,
    },
    {
      title: 'Usuarios',
      value: 1248,
      icon: 'pi pi-users',
      change: '+8.2%',
      currency: false,
    },
    {
      title: 'Pedidos',
      value: 356,
      icon: 'pi pi-shopping-cart',
      change: '+5.4%',
      currency: false,
    },
    {
      title: 'Productos',
      value: 89,
      icon: 'pi pi-box',
      change: '+2.1%',
      currency: false,
    },
  ];

  chartData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Ventas',
        data: [12000, 19000, 15000, 28000, 24000, 35000],
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
  };

  readonly userStore = inject(UserStore);

  readonly totalUsers = this.userStore.totalUsers;
  readonly activeUsers = this.userStore.activeUsers;
  readonly inactiveUsers = this.userStore.inactiveUsers;
}
