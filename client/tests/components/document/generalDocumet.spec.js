import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import { GeneralDocuments }
from '../../../src/components/documents/GeneralDocuments';

const documents = [{
  id: 90,
  title: 'test',
  content: 'test',
  access: 'public',
  userId: 20,
  User: { firstName: 'bola', lastName: 'bola' }
}];

const props = {
  user: { roleId: 1 },
  userId: 20,
  documents: [{
    id: 5,
    title: 'test',
    content: 'test',
    access: 'public',
    userId: 20,
    User: { firstName: 'bola', lastName: 'bola' }
  },
  ],
  pagination: {
    pageCount: 10,
    page: 2,
  },
  location: {
    search: '?access=public&query=test&page=4',
    pathname: ''
  },
  loading: false,
  match: { params: { id: 12 }
  },
  searchDocuments: sinon.spy(() => new Promise((resolve) => { resolve(); })),
  deleteDocument: sinon.spy(() => new Promise((resolve) => { resolve(); })),
  history: { replace: sinon.spy() }
};
let wrapper;

wrapper = shallow(<GeneralDocuments {...props} />);
chai.use(chaiEnzyme());
describe('GeneralDocuments component', () => {
  it('should renders without crashing and ', () => {
    expect(wrapper).to.be.present();
  });
  it('calls update searchDocuments action on mount', () => {
    expect(props.searchDocuments.called).to.equal(true);
  });
  it('should change state.access on props.access change', () => {
    wrapper.setProps({ location: {
      search: '?query=test&access=role&page=3',
      pathname: ''
    }, });
    wrapper.update();
    expect(wrapper.instance().state.access).to.equal('role');
    expect(wrapper.instance().state.query).to.equal('test');
  });
  it('should change state.document on props.document change', () => {
    wrapper.setProps({ documents,
      location: {
        search: '?query=test&access=role&page=3',
        pathname: ''
      }, });
    expect(wrapper.instance().state.documents).to.eql(documents);
  });
  it('should set state.access as "all" when location.search is empty', () => {
    wrapper.setProps({ location: {
      search: '',
      pathname: ''
    }, });
    wrapper.update();
    expect(wrapper.instance().state.access).to.equal('all');
  });
  it('should call change state on select change', () => {
    const newProps = { ...props, location: { search: '', pathname: '' } };
    wrapper = shallow(<GeneralDocuments {...newProps} />);
    const select = wrapper.find('select');
    select.simulate('change', {
      preventDefault: () => {
      },
      target: { value: 'role', name: 'access' } });
    expect(wrapper.instance().state.access).to.eql('role');
    expect(wrapper.find('.progress')).not.to.be.present();
  });
  it('should show progess bar when loading is true', () => {
    wrapper.setProps({ loading: false, documents: [] });
    wrapper.setProps({ loading: true });
    expect(wrapper.find('.progress')).to.be.present();
  });
});

