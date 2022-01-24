import React from 'react';

class SettingsPanel extends React.Component {
  componentDidMount() {}

  render() {
    const { showHelpers, toggleShowHelpers } = this.props;
    const { renderBloom, toggleRenderBloom } = this.props;
    const { resetScene } = this.props;

    return (
      <div
        style={{
          padding: 10,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
      >
        <h3>Settings Panel</h3>
        <hr style={{ width: '100%' }} />
        <div style={{ textAlign: 'left' }}>
          <div>Show Helpers</div>
          <button style={{ margin: 20 }} onClick={toggleShowHelpers}>
            {`${showHelpers}`}{' '}
          </button>
        </div>

        <div style={{ textAlign: 'left' }}>
          <div>Render Bloom Pass</div>
          <button style={{ margin: 20 }} onClick={toggleRenderBloom}>
            {`${renderBloom}`}{' '}
          </button>
        </div>

        <div style={{ textAlign: 'left' }}>
          <div>Scene Force Manual Update</div>
          <button style={{ margin: 20 }} onClick={resetScene}>
            Update
          </button>
        </div>
      </div>
    );
  }
}

export default SettingsPanel;
