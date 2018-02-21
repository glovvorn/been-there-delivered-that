import { Component } from '@angular/core';

import { DeliveriesPage } from '../deliveries/deliveries';
import { MapPage } from '../map/map';
import { HomePage } from '../home/home';
import { SettingsPage } from '../settings/settings';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = DeliveriesPage;
  tab3Root = MapPage;
  tab4Root = SettingsPage;

  constructor() {

  }
}
