import styled from 'styled-components/native';

export interface Props {
  width?: number;
  height?: number;
}

const Space = styled.View<Props>`
  ${p => (p.width ? `width: ${p.width.toFixed()}px;` : '')}
  ${p => (p.height ? `height: ${p.height.toFixed()}px;` : '')}
`;

export default Space;
