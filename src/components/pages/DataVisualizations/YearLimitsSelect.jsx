import React, { useEffect } from 'react';
import { Form, Button /*Input*/ } from 'antd';
import {
  setVisualizationData,
  // setHeatMapYears,
} from '../../../state/actionCreators';
// import YearLimitsSlider from './YearLimitsSlider';
import { rawApiDataToPlotlyReadyInfo, useInterval } from '../../../utils';
import { connect } from 'react-redux';
import { colors } from '../../../styles/data_vis_colors';

const { primary_accent_color } = colors;

const mapStateToProps = (state, ownProps) => {
  const { view, office } = ownProps;
  if (office === 'all' || !office) {
    switch (view) {
      case 'time-series':
        return {
          allData: state.vizReducer.allData,
          years: state.vizReducer.timeSeriesAllYears,
        };
      case 'office-heat-map':
        return {
          allData: state.vizReducer.allData,
          years: state.vizReducer.officeHeatMapYears,
        };
      case 'citizenship':
        return {
          allData: state.vizReducer.allData,
          years: state.vizReducer.citizenshipMapAllYears,
        };
      default:
        return {
          allData: state.vizReducer.allData,
          years: ['', ''],
        };
    }
  } else {
    switch (view) {
      case 'time-series':
        return {
          allData: state.vizReducer.allData,
          years: state.vizReducer.offices[office].timeSeriesYears,
        };
      case 'citizenship':
        return {
          allData: state.vizReducer.allData,
          years: state.vizReducer.offices[office].citizenshipMapYears,
        };
      default:
        return {
          allData: state.vizReducer.allData,
          years: ['', ''],
        };
    }
  }
};

function YearLimitsSelect(props) {
  let { view, office, dispatch, clearQuery, years, allData } = props;

  const stateSettingFn = (view, office, data) => {
    const plotlyReadyData = rawApiDataToPlotlyReadyInfo(view, office, data);
    dispatch(setVisualizationData(view, office, plotlyReadyData));
  };

  const [form] = Form.useForm();
  useInterval(() => {
    form.setFieldsValue({
      year_start: years[0],
      year_end: years[1],
    });
  }, 10);

  useEffect(() => {
    if (Object.keys(allData).length !== 0) {
      stateSettingFn(view, office, allData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allData]);

  return (
    <div
      className="year-limits-select-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '50px',
      }}
    >
      <Form
        form={form}
        name="yearLimitsSelect"
        initialValues={{ year_start: years[0], year_end: years[1] }}
        onFinish={() => {
          stateSettingFn(view, office, allData);
        }}
        autoComplete="off"
        layout="inline"
        wrapperCol={{ span: 45 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Form.Item>
          <Button
            htmlType="submit"
            data-testid="filter"
            style={{
              backgroundColor: primary_accent_color,
              color: 'white',
              marginLeft: '105px',
              marginTop: '10px',
            }}
          >
            Update Query
          </Button>
        </Form.Item>
      </Form>
      <Button
        style={{
          width: '122px', // this is to match the width of the Form.Item button
          backgroundColor: primary_accent_color,
          color: 'white',
          marginLeft: '105px',
        }}
        onClick={() => {
          clearQuery(view, office);
        }}
      >
        Clear Query
      </Button>
    </div>
  );
}

export default connect(mapStateToProps)(YearLimitsSelect);
