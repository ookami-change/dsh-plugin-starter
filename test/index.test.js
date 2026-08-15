import assert from 'node:assert/strict'
import test from 'node:test'

import { isHostAllowed, normalizeVisibleText, parseHttpUrl } from '../index.js'

test('parseHttpUrl accepts absolute HTTP(S) URLs', () => {
  assert.equal(parseHttpUrl('https://joyspace.jd.com/pages/demo').hostname, 'joyspace.jd.com')
  assert.equal(parseHttpUrl('http://example.com/').protocol, 'http:')
})

test('parseHttpUrl rejects unsupported schemes and embedded credentials', () => {
  assert.throws(() => parseHttpUrl('file:///tmp/secret'), /http or https/)
  assert.throws(() => parseHttpUrl('https://user:pass@example.com/'), /embedded credentials/)
})

test('isHostAllowed supports exact hosts and scoped wildcards', () => {
  assert.equal(isHostAllowed('joyspace.jd.com', ['joyspace.jd.com']), true)
  assert.equal(isHostAllowed('docs.example.com', ['*.example.com']), true)
  assert.equal(isHostAllowed('example.com', ['*.example.com']), false)
  assert.equal(isHostAllowed('example.com.attacker.test', ['*.example.com']), false)
  assert.equal(isHostAllowed('anything.example', ['*']), false)
})

test('normalizeVisibleText keeps paragraphs while removing layout noise', () => {
  assert.equal(normalizeVisibleText('  Hello\t world  \n \n \n Next\u00a0line  '), 'Hello world\n\nNext line')
})
