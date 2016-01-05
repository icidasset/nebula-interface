import { createElement } from 'react';

import ContentWithMenu from '../../ContentWithMenu';
import Link from '../../Link';


export default () => {
  return (
    <ContentWithMenu
      menuItems={[]}
      title="Help"
    >
      <p>
        Most of the UI should be self-explanatory, if not,
        you can always create an issue on
        the <a href="https://github.com/icidasset/ongaku-ryoho/issues">Github repo</a>.
      </p>

      <h2>How to get started</h2>

      <ol>
        <li>
          Add a <Link to="/app/sources">source</Link>
          <small> (ie. define where your music is stored)</small>.
        </li>
        <li>Wait for it to be processed.</li>
        <li>Play <Link to="/app">music</Link>.</li>
      </ol>

      <h2>Collections and the queue</h2>

      <p>
        When viewing the <Link to="/app">track-list</Link> you can add tracks
        to <Link to="/app/collections">collections</Link> and to
        the <Link to="/app/queue">queue</Link>.
      </p>

      <p>
        To add a track to, or remove from, a collection, first select a collection
        you want to add something to. You can do that by clicking on the icon next
        to the current-collection label in the search bar, it should say
        <em> target collection</em>. Next, hold the <strong>shift key</strong> on your keyboard
        and double click a track. It should display a notification when you hold
        the correct key and when you added/removed something.
      </p>

      <p>
        To add something to the queue, hold the <strong>alt/option key</strong> and
        double click a track.
      </p>
    </ContentWithMenu>
  );
};
