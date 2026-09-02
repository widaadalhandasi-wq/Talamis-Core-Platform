using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Talamis.Repositories
{
    public interface IGenericRepository<TEntity> where TEntity : class
    {
        Task<TEntity?> GetByIdAsync(Guid id);
        Task<IReadOnlyList<TEntity>> GetAllAsync();
        Task<IReadOnlyList<TEntity>> FindAsync(Expression<Func<TEntity, bool>> predicate);
        Task AddAsync(TEntity entity);
        void Update(TEntity entity);
        void Remove(TEntity entity);
        Task<int> SaveChangesAsync();
    }
}
