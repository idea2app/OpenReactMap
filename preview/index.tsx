import { CodeBlock, Icon, PageNav } from 'idea-react';
import { configure, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Component, ReactNode } from 'react';
import { Button, Col, Collapse, Container, Row } from 'react-bootstrap';
import { createRoot } from 'react-dom/client';

import { OpenReactMap, TileLayer } from '../source';
import { Section } from './Section';

configure({ enforceActions: 'never' });

@observer
export class App extends Component {
    componentDidMount() {
        this.updateMeta();
        window.addEventListener('resize', this.updateMeta);
    }

    @observable
    accessor mapAddressName = '成都市';

    @observable
    accessor screenPortrait = false;

    @observable
    accessor menuOpen = false;

    updateMeta = () =>
        (this.screenPortrait = window.innerWidth < window.innerHeight);

    renderCode(code: ReactNode) {
        return (
            <>
                {code}
                <CodeBlock language="tsx">{code}</CodeBlock>
            </>
        );
    }

    renderContent() {
        const { mapAddressName } = this;

        return (
            <>
                <h1 id="top">Open Map examples</h1>

                <Section title="Basic">
                    {this.renderCode(
                        <OpenReactMap center={[34.32, 108.55]} zoom={4} />
                    )}
                </Section>

                <Section title="Display Address">
                    {this.renderCode(
                        <OpenReactMap
                            zoom={10}
                            title="天府之国"
                            address="成都市"
                        />
                    )}
                </Section>

                <Section title="Pick Address">
                    {this.renderCode(
                        <OpenReactMap
                            center={[30.66, 104.06]}
                            zoom={10}
                            address={mapAddressName}
                            onChange={({ address }) =>
                                (this.mapAddressName = address)
                            }
                        />
                    )}
                </Section>

                <Section title="China Tile">
                    {this.renderCode(
                        <OpenReactMap
                            center={[34.32, 108.55]}
                            zoom={4}
                            address={mapAddressName}
                            renderTileLayer={() => <TileLayer vendor="GaoDe" />}
                            onChange={({ address }) =>
                                (this.mapAddressName = address)
                            }
                        />
                    )}
                </Section>
            </>
        );
    }

    renderMenu() {
        const { screenPortrait, menuOpen } = this;

        return (
            <>
                <Button
                    className="my-3 d-md-none"
                    onClick={() => (this.menuOpen = !menuOpen)}
                >
                    <Icon name="list" />
                </Button>
                <Collapse in={screenPortrait ? menuOpen : true}>
                    <div className="sticky-top">
                        <PageNav
                            onClick={() =>
                                screenPortrait && (this.menuOpen = false)
                            }
                        />
                    </div>
                </Collapse>
            </>
        );
    }

    render() {
        return (
            <div className="bg-light">
                <Container className="pb-3 py-md-5" fluid="md">
                    <Row>
                        <Col xs={12} md={3} className="sticky-top bg-light">
                            {this.renderMenu()}
                        </Col>
                        <Col xs={12} md={9}>
                            {this.renderContent()}
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

createRoot(document.querySelector('main')).render(<App />);
