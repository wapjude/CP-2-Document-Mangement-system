import log from 'npmlog';
import fakeData from './fakeData';
import db from '../../models';

const validAdmin = fakeData.validAdmin,
  regulerUser1 = fakeData.regulerUser1,
  regulerUser2 = fakeData.regulerUser2,
  regulerUser3 = fakeData.regulerUser3;
/**
 * @class seeder
 */
class Seeder {
/**
 * @desc initializes thes seeding of data into the db.
 * @static
 * @returns {promise} returns a promise
 * @memberof seeder
 */
  static init() {
    log.info('message', 'seeding Datatbase');
    return db.sequelize.sync({ force: true })
    .then(() => this.populateRoleTable()
      .then(() => this.populateUserTable()
        .then(() => this.populateDocumentTable()
          .then(() => {
            log.info('message', 'seed complete ');
          })
          .catch((err) => {
            log.error('error', err);
          }))
        .catch((err) => {
          log.error('error', err);
        }))
      .catch((err) => {
        log.error('error', err);
      }))
    .catch((err) => {
      log.error('error', err);
    });
  }
  /**
   * @desc it populates the role table
   * @static
   * @returns {promise} returns a promise
   * @memberof seeder
   */
  static populateRoleTable() {
    const roles = [
      fakeData.adminRole, fakeData.regularRole, fakeData.fellowRole
    ];
    return db.Role.bulkCreate(roles);
  }
  /**
   * @desc it populates the user table
   * @static
   * @returns {promise} returns a promise
   * @memberof seeder
   */
  static populateUserTable() {
    return db.User.create(validAdmin)
     .then(() => db.User.create(regulerUser1)
       .then(() => db.User.create(regulerUser2)
         .then(() => db.User.create(regulerUser3))));
  }
  /**
   * @desc it popultes the document table
   * @static
   * @returns {promise} returns a promise
   * @memberof seeder
   */
  static populateDocumentTable() {
    const documents = [
      fakeData.privateDocument1,
      fakeData.privateDocument2,
      fakeData.privateDocument3,
      fakeData.publicDocument1,
      fakeData.publicDocument2,
      fakeData.publicDocument3,
      fakeData.publicDocument4,
      fakeData.roleDocument1,
      fakeData.roleDocument2,
      fakeData.roleDocument3,
    ];
    return db.Document.bulkCreate(documents);
  }
}
export default Seeder;
