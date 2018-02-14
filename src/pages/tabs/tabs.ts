import { Component } from '@angular/core';

import { DeliveriesPage } from '../deliveries/deliveries';
// import { TripsPage } from '../trips/trips';
import { MapPage } from '../map/map';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  // tab2Root = TripsPage;
  tab3Root = DeliveriesPage;
  tab4Root = MapPage;

  constructor() {

  }
}
