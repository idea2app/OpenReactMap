import { CodeBlock, PageNav } from 'idea-react';
import { configure, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { PureComponent, ReactNode } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { render } from 'react-dom';

import { OpenReactMap, TileLayer } from '../source';
import { Section } from './Section';

configure({ enforceActions: 'never' });

@observer
export class App extends PureComponent {
    constructor(props: {}) {
        super(props);
        makeObservable(this);
    }

    @observable
    mapAddressName = '成都市';

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
                        <OpenReactMap
                            className="vh-100"
                            center={[34.32, 108.55]}
                            zoom={4}
                        />
                    )}
                </Section>

                <Section title="Display Address">
                    {this.renderCode(
                        <OpenReactMap
                            className="vh-100"
                            zoom={10}
                            title="天府之国"
                            address="成都市"
                        />
                    )}
                </Section>

                <Section title="Pick Address">
                    {this.renderCode(
                        <OpenReactMap
                            className="vh-100"
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
                            className="vh-100"
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

    render() {
        return (
            <div className="bg-light">
                <Container className="py-5" fluid="md">
                    <Row>
                        <Col xs={12} sm={3}>
                            <PageNav className="sticky-top" />
                        </Col>
                        <Col xs={12} sm={9}>
                            {this.renderContent()}
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

render(<App />, document.querySelector('main'));
