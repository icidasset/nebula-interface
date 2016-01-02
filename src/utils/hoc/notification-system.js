import NotificationSystem from 'react-notification-system';
import React, { createElement } from 'react';
import difference from 'lodash/array/difference';

import * as actions from '../../actions/notifications';
import * as reduxUtils from '../redux';


export default function(store) {
  return React.createClass({


    componentDidMount() {
      this.store = store;
      this.unsubscribe = reduxUtils.observeStore(
        store,
        (state) => state.notifications.items,
        (notifications) => this.diffNotifications(notifications)
      );

      this.diffNotifications(store.getState().notifications.items);
    },


    componentWillUnmount() {
      this.unsubscribe();
    },


    handleNotificationSystemRemove(n) {
      this.store.dispatch(actions.removeNotification(n.uid));
    },


    diffNotifications(sourceOfTruth) {
      const onRemove = this.handleNotificationSystemRemove;

      this.local = this.local || [];

      const removed = difference(
        this.local.map((i) => i.uid),
        sourceOfTruth.map((i) => i.uid)
      );

      const added = difference(
        sourceOfTruth.map((i) => i.uid),
        this.local.map((i) => i.uid)
      );

      removed.forEach((uid) => {
        this.refs.notificationSystem.removeNotification(uid);
      });

      added.forEach((uid) => {
        let i;

        i = sourceOfTruth.find((i) => i.uid === uid);
        i = { ...i, onRemove };

        this.refs.notificationSystem.addNotification(i);
      });

      this.local = sourceOfTruth.slice(0);
    },


    render() {
      return (
        <NotificationSystem ref="notificationSystem" style={false} />
      );
    },

  });
}
