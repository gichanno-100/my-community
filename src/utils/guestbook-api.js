import { supabase } from '../lib/supabase.js';

/** 게시글 조회 시 공통으로 가져올 컬럼 (작성자, 좋아요 수, 댓글 수 포함) */
const POST_COLUMNS = 'id, author_id, content, created_at, updated_at, author:profiles!posts_author_id_fkey(nickname, avatar_url), post_likes(count), comments(count)';

/**
 * Supabase 응답 에러를 throw 하고 데이터만 반환
 * @param {{ data: any, error: object|null }} response
 */
function unwrap({ data, error }) {
  if (error) throw error;
  return data;
}

/**
 * 게시글 행을 화면에서 쓰기 쉬운 형태로 변환
 * @param {object} row - posts 조회 결과 한 행
 */
function normalizePost(row) {
  return {
    id: row.id,
    authorId: row.author_id,
    content: row.content,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    authorName: row.author?.nickname ?? '알 수 없음',
    likeCount: row.post_likes?.[0]?.count ?? 0,
    commentCount: row.comments?.[0]?.count ?? 0,
  };
}

/**
 * 댓글 행을 화면에서 쓰기 쉬운 형태로 변환
 * @param {object} row - comments 조회 결과 한 행
 */
function normalizeComment(row) {
  return {
    id: row.id,
    postId: row.post_id,
    authorId: row.author_id,
    content: row.content,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    authorName: row.author?.nickname ?? '알 수 없음',
    postContent: row.post?.content ?? '',
  };
}

/* ---------- 게시글 ---------- */

/**
 * 게시글 목록 (최신순)
 * @param {number} [limit] - 가져올 최대 개수
 */
export async function fetchPosts(limit) {
  let query = supabase.from('posts').select(POST_COLUMNS).order('created_at', { ascending: false });
  if (limit) query = query.limit(limit);
  return unwrap(await query).map(normalizePost);
}

/**
 * 게시글 1건
 * @param {string} postId
 */
export async function fetchPost(postId) {
  const row = unwrap(await supabase.from('posts').select(POST_COLUMNS).eq('id', postId).maybeSingle());
  return row ? normalizePost(row) : null;
}

/**
 * 게시글 작성
 * @param {string} authorId
 * @param {string} content
 */
export async function createPost(authorId, content) {
  return unwrap(await supabase.from('posts').insert({ author_id: authorId, content }).select('id').single());
}

/**
 * 게시글 수정
 * @param {string} postId
 * @param {string} content
 */
export async function updatePost(postId, content) {
  return unwrap(await supabase.from('posts').update({ content }).eq('id', postId).select('id').single());
}

/**
 * 게시글 삭제 (댓글, 좋아요는 DB에서 함께 삭제됨)
 * @param {string} postId
 */
export async function deletePost(postId) {
  return unwrap(await supabase.from('posts').delete().eq('id', postId));
}

/* ---------- 좋아요 ---------- */

/**
 * 내가 좋아요 누른 게시글 ID 목록
 * @param {string} userId
 * @param {string[]} postIds
 * @returns {Promise<Set<string>>}
 */
export async function fetchLikedPostIds(userId, postIds) {
  if (!userId || postIds.length === 0) return new Set();
  const rows = unwrap(
    await supabase.from('post_likes').select('post_id').eq('user_id', userId).in('post_id', postIds),
  );
  return new Set(rows.map((row) => row.post_id));
}

/**
 * 좋아요 토글 (누르지 않았으면 추가, 이미 눌렀으면 취소)
 * @param {string} userId
 * @param {string} postId
 * @param {boolean} isLiked - 현재 좋아요 상태
 */
export async function toggleLike(userId, postId, isLiked) {
  if (isLiked) {
    return unwrap(await supabase.from('post_likes').delete().eq('user_id', userId).eq('post_id', postId));
  }
  return unwrap(await supabase.from('post_likes').insert({ user_id: userId, post_id: postId }));
}

/* ---------- 댓글 ---------- */

/**
 * 게시글의 댓글 목록 (오래된 순)
 * @param {string} postId
 */
export async function fetchComments(postId) {
  const rows = unwrap(
    await supabase
      .from('comments')
      .select('id, post_id, author_id, content, created_at, updated_at, author:profiles!comments_author_id_fkey(nickname)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true }),
  );
  return rows.map(normalizeComment);
}

/**
 * 댓글 작성
 * @param {string} authorId
 * @param {string} postId
 * @param {string} content
 */
export async function createComment(authorId, postId, content) {
  return unwrap(await supabase.from('comments').insert({ author_id: authorId, post_id: postId, content }));
}

/**
 * 댓글 수정
 * @param {string} commentId
 * @param {string} content
 */
export async function updateComment(commentId, content) {
  return unwrap(await supabase.from('comments').update({ content }).eq('id', commentId).select('id').single());
}

/**
 * 댓글 삭제
 * @param {string} commentId
 */
export async function deleteComment(commentId) {
  return unwrap(await supabase.from('comments').delete().eq('id', commentId));
}

/* ---------- 내 활동 ---------- */

/**
 * 내가 작성한 게시글
 * @param {string} userId
 */
export async function fetchMyPosts(userId) {
  const rows = unwrap(
    await supabase.from('posts').select(POST_COLUMNS).eq('author_id', userId).order('created_at', { ascending: false }),
  );
  return rows.map(normalizePost);
}

/**
 * 내가 작성한 댓글 (원글 내용 포함)
 * @param {string} userId
 */
export async function fetchMyComments(userId) {
  const rows = unwrap(
    await supabase
      .from('comments')
      .select('id, post_id, author_id, content, created_at, updated_at, author:profiles!comments_author_id_fkey(nickname), post:posts(content)')
      .eq('author_id', userId)
      .order('created_at', { ascending: false }),
  );
  return rows.map(normalizeComment);
}

/**
 * 내가 좋아요 누른 게시글
 * @param {string} userId
 */
export async function fetchLikedPosts(userId) {
  const rows = unwrap(
    await supabase
      .from('post_likes')
      .select(`created_at, post:posts(${POST_COLUMNS})`)
      .eq('user_id', userId)
      .order('created_at', { ascending: false }),
  );
  return rows.filter((row) => row.post).map((row) => normalizePost(row.post));
}

/* ---------- 프로필 ---------- */

/**
 * 닉네임 수정
 * @param {string} userId
 * @param {string} nickname
 */
export async function updateNickname(userId, nickname) {
  return unwrap(await supabase.from('profiles').update({ nickname }).eq('id', userId).select('id').single());
}
