import { TrendingRio } from '@/lib/dbActions';
import { useState } from 'react';
import { Col } from 'react-bootstrap';
// import { Rio } from '@prisma/client';

const RIOCardDisplay = ({ rioList }: { rioList: TrendingRio [] }) => (
  const [selected, setSelected] = useState<TrendingRio | null>(null);
<>
  {rioList.map((rio) => (
    <Col key={rio.id}>
      <div
        className="trending-card"
        style={{ cursor: 'pointer' }}
        onClick={() => setSelectedRio(rio)}
      >
        <h5 className="trending-card-title">{rio.name}</h5>
        <p className="trending-card-text">{rio.blurb}</p>
      </div>
    </Col>
  ))}
</>
);

export default RIOCardDisplay;
