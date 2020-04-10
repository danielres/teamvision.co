import { ForeignKeyViolationError, UniqueViolationError } from 'db-errors';
import samples from './samples';

const {
  Tenant: { tenant1 },
} = samples;

export const constraints = {};

const getSamplesForTable = table => Object.values(samples[table]);

constraints.referencesTenantByTenantId = ({ store, table }) =>
  it('references a tenant by tenantId', async () => {
    const uuid = '7ec5163c-e4b5-4ba3-84e9-71536407c9bb';
    const [sample] = getSamplesForTable(table);
    const ResourceStore = store[table](uuid);
    await expect(ResourceStore.insert(sample)).rejects.toMatchObject({
      constraint: `${table.toLowerCase()}_tenantid_foreign`,
      name: ForeignKeyViolationError.name,
      table,
    });
  });

constraints.hasUniqueColumnByTenantId = ({ store, table, column }) =>
  it(`has unique ${column} by tenantId`, async () => {
    const { Tenant } = store;

    const { id: tenantId1 } = await Tenant.insert(tenant1);
    const ResourceStore1 = store[table](tenantId1);

    const [sample1, sample2] = getSamplesForTable(table);

    const SAME_VALUE = sample1[column];
    await ResourceStore1.insert({ ...sample1, [column]: SAME_VALUE });

    await expect(ResourceStore1.insert({ ...sample2, [column]: SAME_VALUE })).rejects.toMatchObject({
      name: UniqueViolationError.name,
      columns: [column, 'tenantId'],
      constraint: `${table.toLowerCase()}_${column}_tenantid_unique`,
    });
  });
