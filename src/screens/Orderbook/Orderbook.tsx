import * as React from 'react';
import type { FC } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Platform,
  useWindowDimensions,
} from 'react-native';

import { default as OrderbookSection } from './components/OrderbookSection';

import GroupByButtonGroup from './atoms/GroupByButtonGroup';
import {
  ErrorScreen,
  ERROR_TITLES,
  ERROR_TYPES,
} from '@components/ErrorScreen';
import LoadingOverlay from '@components/LoadingOverlay';
import type { OrderbookProps } from './types';

import { useOrderbookController } from './hooks';

const MIDDLE_MENU_RELATIVE_HEIGHT = 0.15;
const ROW_VERTICAL_MARGIN = 2;

const FONT_SIZE = 18;
const LINE_HEIGHT_DEFAULT_RATIO = 1.1;
const SUGGESTED_ROW_HEIGHT =
  FONT_SIZE * 2 * LINE_HEIGHT_DEFAULT_RATIO + ROW_VERTICAL_MARGIN * 2;

const determineNumberOfRowsAutomatically = (
  deviceHeight: number,
  suggestedRowHeight = SUGGESTED_ROW_HEIGHT,
): number =>
  Math.ceil(
    (deviceHeight * (1 - MIDDLE_MENU_RELATIVE_HEIGHT)) / suggestedRowHeight,
  );

const OrderbookComponent: FC<OrderbookProps> = ({
  initialGroupBy = 100,
  productId = 'PI_XBTUSD',
  webSocketUri = 'wss://www.cryptofacilities.com/ws/v1',
  numberOfRowsPerSection = null,
}) => {
  const { height } = useWindowDimensions();

  const effectiveNumberOfRowsPerSection = React.useMemo(
    () =>
      Math.floor(
        numberOfRowsPerSection !== null
          ? numberOfRowsPerSection
          : determineNumberOfRowsAutomatically(
              height - (StatusBar.currentHeight || 0),
              SUGGESTED_ROW_HEIGHT,
            ) / 2,
      ),
    [numberOfRowsPerSection, height],
  );

  const improvedRowHeight = React.useMemo(
    () =>
      Math.floor(
        (height * (1 - MIDDLE_MENU_RELATIVE_HEIGHT)) /
          (effectiveNumberOfRowsPerSection * 2),
      ),
    [effectiveNumberOfRowsPerSection, height],
  );

  const containersHeight = improvedRowHeight * effectiveNumberOfRowsPerSection;

  const { asksData, bidsData, isLoading, orderBookDispatch, groupBy, wsState } =
    useOrderbookController({
      subscribeToProductIds: [productId],
      initialGroupBy,
      webSocketUri,
      rowsPerSection: effectiveNumberOfRowsPerSection,
    });

  return (
    <View style={styles.flex1}>
      {true ||
        (!isLoading && wsState.isConnected === false && (
          <ErrorScreen
            errorType={
              /*  connectionStatus.connectedToInternet === false
              ? ERROR_TYPES.INTERNET_IS_UNAVAILABLE
              : */ ERROR_TITLES[ERROR_TYPES.SERVICE_IS_UNAVAILABLE]
            }
          />
        ))}

      <View style={styles.orderBookSubWrapper}>
        <View
          style={[
            styles.firstColWrap,
            { height: containersHeight, overflow: 'hidden' },
          ]}>
          {asksData.length > 0 && (
            <OrderbookSection
              rowHeight={improvedRowHeight}
              keyPrefix={'a_'}
              backgroundColor={'#7c0a02'}
              normalizedData={asksData}
              totalOrderBy={'asc'}
              groupBy={groupBy}
            />
          )}
        </View>
        <View style={styles.orderBookSummaryWrap}>
          {/*spreadCalcIsReady && (
            <SpreadWidget bids={orderBook.bids} asks={orderBook.asks} />
          )*/}
          <Text style={styles.groupText}>
            Group: <Text style={styles.groupCounter}>{groupBy}</Text>
          </Text>
          <GroupByButtonGroup
            groupBy={groupBy}
            orderBookDispatch={orderBookDispatch}
          />
        </View>
        <View
          style={[
            styles.secondColWrap,
            { height: containersHeight, overflow: 'hidden' },
          ]}>
          {bidsData.length > 0 && (
            <OrderbookSection
              rowHeight={improvedRowHeight}
              keyPrefix={'b_'}
              backgroundColor={'#043927'}
              normalizedData={bidsData}
              totalOrderBy={'desc'}
              groupBy={groupBy}
            />
          )}
        </View>
      </View>
      <LoadingOverlay visible={isLoading} />
    </View>
  );
};

export default OrderbookComponent;

const styles = StyleSheet.create({
  orderBookSummaryWrap: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    height: '10%',
    padding: '2.5%',
  },
  orderBookSubWrapper: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    alignContent: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },

  groupText: { flex: 1, flexShrink: 0, color: '#fff' },
  firstColWrap: {
    height: '45%',
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  secondColWrap: { height: '45%', overflow: 'hidden' },
  flex1: { flex: 1 },
  groupCounter: {
    paddingLeft: 10,
    fontSize: 16,
    fontFamily:
      Platform.OS === 'android'
        ? 'RobotoMono-VariableFont_wght'
        : 'Roboto Mono',
  },
});
