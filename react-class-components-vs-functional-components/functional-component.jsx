import React, { useState } from 'react'
import { Menu } from 'semantic-ui-react'

function Menubar() {

  const [activeItem, setActiveItem] = useState('');

  const handleItemClick = (e, { name }) => setActiveItem(name);

    return (
        <Menu pointing secondary>
          <Menu.Item
            name='home'
            active={activeItem === 'home'}
            onClick={handleItemClick}
          />
          <Menu.Item
            name='messages'
            active={activeItem === 'messages'}
            onClick={handleItemClick}
          />

          <Menu.Menu position='right'>
            <Menu.Item
              name='login'
              active={activeItem === 'friends'}
              onClick={handleItemClick}
            />
            <Menu.Item
              name='register'
              active={activeItem === 'logout'}
              onClick={handleItemClick}
            />
          </Menu.Menu>
        </Menu>
    );
}

export default MenuBar;
